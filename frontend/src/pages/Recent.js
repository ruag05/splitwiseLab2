import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Recent.css"
import { FaCartPlus } from "react-icons/fa";
import Pagination from '../components/Pagination';
import { useAlert } from "react-alert";

import { useSelector, useDispatch } from "react-redux";
import { getGroupsName, getHistory } from '../Actions/RecentActivitiesActions';

export default function Recent() {
  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.recentActivities);

  const alert = useAlert();

  const [filterGrp, setFilterGrp] = useState('all');
  const [actualHistory, setActualHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [gids, setGids] = useState([]);
  const [gNames, setGNames] = useState(new Map());
  const [toShow, setToShow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(2);

  const handleFilter = (e) => {
    setFilterGrp(e.target.value)
    setCurrentPage(1);
  };

  const handlePageSize = (e) => {
    setHistoryPerPage(e.target.value);
    setCurrentPage(null);
    setCurrentPage(1);
  };

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getGroupsName());

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getHistory());  
  }, []);

  useEffect(() => {
    let names = new Map();
    redux_data.groups.map(g => {
      names.set(g._id, g.name);
    });

    setGNames(names)
  }, [redux_data.groups])

  useEffect(() => {
    setHistory(redux_data.history);
    setActualHistory(redux_data.history);

    //get current posts
    const indexOfLastHistory = currentPage * historyPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
    const currentHistory = redux_data.history.slice(indexOfFirstHistory, indexOfLastHistory);

    setToShow(currentHistory.sort(sortBydate));
    setGids(redux_data.gids);
  }, [redux_data.history])

  useEffect(() => {
    if (filterGrp === null) {
      console.log("filterGrp empty");
    }
    else if (filterGrp === "all") {
      console.log("filterGrp all");
      setActualHistory(redux_data.history);

      //get current posts
      const indexOfLastHistory = currentPage * historyPerPage;
      const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
      const currentHistory = redux_data.history.slice(indexOfFirstHistory, indexOfLastHistory);

      setToShow(currentHistory.sort(sortBydate));
    }
    else {
      console.log("filterGrp not empty");

      const filteredHistory = redux_data.history.filter((hist) => hist.groupId === filterGrp);
      setActualHistory(filteredHistory)

      //get current posts
      const indexOfLastHistory = currentPage * historyPerPage;
      const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
      const currentHistory = filteredHistory.slice(indexOfFirstHistory, indexOfLastHistory);

      setToShow(currentHistory.sort(sortBydate));
    }
  }, [filterGrp, currentPage, historyPerPage])

  function sortBydate(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  function formatDate(string) {
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(string).toLocaleDateString([], options);
  }

  const filteredItems = history.filter((hist) => hist.groupId === filterGrp);
  return (
    <div style={{ marginTop: 20 }}>
      <div className="container" style={{ height: 47, backgroundColor: "darkgray" }}>
        <table>
          <tr>
            <td>
              <h5 style={{ marginTop: 10, marginRight: 5, color: "white", backgroundColor: "transparent" }}>Select a group to view its history</h5>
            </td>
            <td>
              <select onChange={handleFilter} style={{
                marginTop: 5, marginRight: 30, border: "1px solid gray", color: "white", backgroundColor: "darkgray",
                borderTop: 0, borderRight: 0, borderLeft: 0, fontSize: 20, width: 50
              }}>
                <option value="all" key="dfds">All</option>
                {gids.map((g) => {
                  return (
                    <option key={g} value={g}>
                      Group: {gNames.get(g)}
                    </option>
                  );
                })}
              </select>
            </td>
            <td >
              <h5 style={{ marginTop: 10, color: "white", backgroundColor: "transparent", width: 150 }}>Select page size</h5>
            </td>
            <td>
              <select name="pageSize" id="pageSize" onChange={handlePageSize} style={{
                marginTop: 5, border: "1px solid gray", borderTop: 0, borderRight: 0, borderLeft: 0,
                fontSize: 20, color: "white", backgroundColor: "darkgray"
              }}
              >
                <option>2</option>
                <option>5</option>
                <option>10</option>
              </select>
            </td>
          </tr>
        </table>
        <hr></hr>
        {!toShow.length && (
          <div className="bg-warning">Nothing to show</div>
        )}
        {toShow.map((h) => {
          return (
            <div className="m-2" style={{ borderLeft: "darkgray", borderLeftWidth: "5px", borderLeftStyle: "solid" }}>
              <div className="t-icon">
                <FaCartPlus color="gray" size="30" />
              </div>
              <div className="pl-5" style={{ color: "gray" }}>
                <span>
                  <h5 style={{ fontSize: 20, fontWeight: "bolder", color: "gray" }}>Group: {gNames.get(h.groupId)}</h5>
                  <h6 style={{ fontSize: 16, color: "gray" }}>{h.title}</h6>
                </span>
                {gNames.get(h.groupId).getDay}
                <p style={{ fontSize: 12, fontWeight: "bold", color: "darkgray" }}>{formatDate(h.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <Pagination historyPerPage={historyPerPage} totalHistory={actualHistory.length} paginate={paginate} />
      </div>
    </div>
  );
}