import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Recent.css"
import { FaCartPlus } from "react-icons/fa";
import Pagination from '../components/Pagination';
import { useAlert } from "react-alert";

export default function Recent() {
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
    console.log("Selected group ID.........e.target.value:", e.target.value);
    setFilterGrp(e.target.value)
    setCurrentPage(1);
    // if (e.target.value === "all") {
    //   setToShow([...history.sort(sortBydate)]);
    //   return;
    // }
   // let newList = history.filter((hist) => hist.groupId === e.target.value);
    //setToShow([...newList.reverse()]);
  };

  const handlePageSize = (e) => {
    setHistoryPerPage(e.target.value);
    setCurrentPage(null);
    setCurrentPage(1);
  };

  const paginate = pageNumber => {
    console.log("pageNumber.............", pageNumber);
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    console.log("Inside useEffect based on initial load");
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/groups/getAllGroupsName")
      .then((res) => {
        let names = new Map();
        res.data.groups.map(g => {
          names.set(g._id, g.name);
        });
      
        setGNames(names);

        // gNames.map(entry => {
        //   entry.createdAt = entry.createdAt.getDay()
        // });
      })
      .catch((err) => {
        alert.error(String(err));
      });

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/users/getAllHistory")
      .then((res) => {
        console.log("res.data.history.length..........", res.data.history.length)
        setHistory(res.data.history);
        setActualHistory(res.data.history);

        //get current posts
        const indexOfLastHistory = currentPage * historyPerPage;
        const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
        const currentHistory = res.data.history.slice(indexOfFirstHistory, indexOfLastHistory);

        setToShow(currentHistory.sort(sortBydate));
        setGids(res.data.gids);
      })
      .catch((err) => { });
  }, []);

  useEffect(() => {
    console.log("Inside useEffect based on filterGrp");
    if (filterGrp === null) {
      console.log("filterGrp empty");
    }
    else if(filterGrp === "all"){
      console.log("filterGrp all");
      console.log("Selected group ID:.........", filterGrp);
      setActualHistory(history);

      //get current posts
      const indexOfLastHistory = currentPage * historyPerPage;
      const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
      const currentHistory = history.slice(indexOfFirstHistory, indexOfLastHistory);

      //setHistory(currentHistory.sort(sortBydate));
      setToShow(currentHistory.sort(sortBydate));
      //setGids(res.data.gids);
    }
    else {
      console.log("filterGrp not empty");
      console.log("Selected group ID:.........", filterGrp);

      const filteredHistory = history.filter((hist) => hist.groupId === filterGrp);
      console.log("filtered history length...........: ", filteredHistory.length)

      setActualHistory(filteredHistory)

      //get current posts
      const indexOfLastHistory = currentPage * historyPerPage;
      const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
      const currentHistory = filteredHistory.slice(indexOfFirstHistory, indexOfLastHistory);

      //setHistory(currentHistory.sort(sortBydate));
      setToShow(currentHistory.sort(sortBydate));
      //setGids(res.data.gids);
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
  console.log("---------------history----------------", history)
  console.log("---------------actualHistory----------------", actualHistory)
  console.log("---------------currentPage----------------", currentPage)
  console.log("---------------historyPerPage----------------", historyPerPage)
  console.log("---------------toShow----------------", toShow)

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
              <p className="pl-5" style={{ color: "gray" }}>
                <span>
                  <h5 style={{ fontSize: 20, fontWeight: "bolder", color: "gray" }}>Group: {gNames.get(h.groupId)}</h5>
                  <h6 style={{ fontSize: 16, color: "gray" }}>{h.title}</h6>
                </span>
                {gNames.get(h.groupId).getDay}
                <p style={{ fontSize: 12, fontWeight: "bold", color: "darkgray" }}>{formatDate(h.createdAt)}</p>
              </p>
            </div>
          );
        })}
        <Pagination historyPerPage={historyPerPage} totalHistory={actualHistory.length} paginate={paginate} />
      </div>
    </div>
  );
}