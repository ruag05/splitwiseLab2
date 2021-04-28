import "./AddComment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faComments, faTimes, faClipboard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import Modal from "react-modal";
import { useAlert } from "react-alert";

export default function AddComment(props) {   

    const alert = useAlert();

    const [expId, setExpId] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const inputComment = React.useRef();
    const [modalIsOpen, setIsOpen] = useState(false);

    const customStyles = {
        content: {
            top: "40%",
            left: "50%",
            right: "55%",
            bottom: "auto",
            marginRight: "-40%",
            transform: "translate(-40%, -40%)",
        },
    };

    function defineState() {
        setExpId(props.expId);
    }

    function fetchComments() {
        if (expId !== null) {
            axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
            axios.defaults.withCredentials = true;
            setComments([]);
            axios.get(`/groups/getComments/${expId}`)
                .then((doc) => {
                    setComments(doc.data.comments);
                    //inputComment.current.value = "";
                })
        }
    }

    const handleChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (expId !== null) {
            axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
            axios.defaults.withCredentials = true;
            axios.post('/groups/postComment', { ...comment, expId })
                .then(() => {
                    fetchComments();
                    alert.success("Comment Added");

                })
        }
    }

    useEffect(() => {
        defineState();
    }, []);

    useEffect(() => {
        if (expId !== null) {
            fetchComments();
        }
    }, [expId]);

    function formatDate(d) {
        return ("0" + d.getDate()).slice(-2)
    }

    function openModal() {
        setIsOpen(true);

        // //check if author is comment author
        // axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
        // axios.defaults.withCredentials = true;
        // axios.
        //     post('/groups/getCommentAuthor', { commentId })
    }

    function afterOpenModal() { }

    function closeModal() {
        // console.log(sUsers);
        setIsOpen(false);
    }

    const handleDeleteComment = (e, commentId) => {
        e.preventDefault();
        if (e.type === "submit" && expId !== null) {
            axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
            axios.defaults.withCredentials = true;
            axios.
                post('/groups/deleteComment', { expId, commentId })
                .then(res => {
                    //closeModal();
                    if (res.data.success) {
                        alert.show(`${res.data.msg}`);
                        fetchComments();
                        closeModal();
                    }
                    else {
                        alert.error(`${res.data.msg}`);
                        closeModal();
                    }
                })
                .catch((err) => {
                    if (err.response?.data.errors) {
                        err.response?.data.errors.map((e) => {
                            alert.error("Error: " + e)
                        });
                    } else {
                        alert.error("Something went wrong");
                    }
                })
        }
        else
            console.log("cancelled")
    }
    return (
        <table>
            <tbody>
                <tr>
                    <td className="left mx-2" style={{ alignContent: "center", width: '310px', verticalAlign: 'top', color: "white" }}>
                        <h5 style={{ verticalAlign: 'bottom', paddingLeft: "2%" }}>Notes
                        <FontAwesomeIcon icon={faComments} size="sm" style={{ marginLeft: "2%", height: 30 }} />
                        </h5>
                        <div className="comments" style={{ overflow: 'auto', height: 170, paddingRight: '5px' }}>
                            {comments.length < 1 ? <h5 style={{ paddingLeft: "2%" }}>No comments yet</h5> : null}
                            {comments.map((c) => {
                                const d = new Date(c.createdAt);
                                return (
                                    <div className="px-2 mt-1 mb-1 text-white rounded top" style={{ fontSize: 15, backgroundColor: "white", borderRadius: "5px", boxShadow: 'inset 0 1px 1px rgb(0 0 0 / 8%)' }}>
                                        <td width="10%">
                                            <FontAwesomeIcon style={{ verticalAlign: 'top', marginTop: "6px" }} color="gray" icon={faClipboard} size="2x" />
                                        </td>
                                        <td width="5%">
                                            <div className="divClass px-1" style={{ color: "gray" }}>
                                                <div style={{ fontWeight: 400 }}>{d.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                                                <div style={{ paddingLeft: "11%", fontWeight: 700 }}>{formatDate(d)}</div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            <div className="centered" style={{ display: "flex", flexFlow: "nowrap", color: "gray" }}>{c.authorId.name} added {c.comment}</div>
                                        </td>
                                        <td width="20%">
                                        </td>

                                        <td width="10%" align="right">
                                            <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} color="red" size="sm"
                                                onClick={openModal} />
                                        </td>
                                        <Modal
                                            isOpen={modalIsOpen}
                                            onAfterOpen={afterOpenModal}
                                            onRequestClose={closeModal}
                                            contentLabel="Add Expense"
                                            style={customStyles}
                                        >
                                            <h2 className="settle-form">Delete Comment!</h2>
                                            <form onSubmit={(e) => handleDeleteComment(e, c._id)}>
                                                <section className="container">
                                                    <br></br>
                                                    <p className="left" >
                                                        Are you sure you want to delete the comment "{c.comment}"?
                                                    </p>
                                                </section>
                                                <div className="buttons">
                                                    <button onClick={closeModal} className="cancelbutton">
                                                        Cancel
                                                    </button>
                                                    <input
                                                        type="submit"
                                                        value="Sure"
                                                        className="savebutton"
                                                    />
                                                </div>
                                            </form>
                                        </Modal>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                    <td className="right mx-2" style={{ alignContent: "center", verticalAlign: 'top', color: "white", marginRight: "auto" }}>
                        <h5 style={{ paddingLeft: "1%" }}>
                            Notes and Comments
                            <FontAwesomeIcon icon={faComment} size="sm" style={{ marginLeft: "2%", height: 30 }} />
                        </h5>
                        <div className="add_comment" style={{ marginBottom: "3%" }}>
                            <form onSubmit={handlePost}>
                                <textarea id="comment" type="text" placeholder="Add a comment" cols="34" rows="5"
                                    ref={inputComment} onChange={handleChange} name="comment" required autofocus>
                                </textarea>
                                <br></br>
                                <button type="submit" className="btn btn-small btn-orange">Post</button>
                            </form>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};