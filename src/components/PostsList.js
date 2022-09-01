import React, { useState, useEffect, useMemo, useRef } from "react";
import PostDataService from "../services/PostService";
import { useTable } from "react-table";

const PostsList = (props) => {
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const postsRef = useRef();

  postsRef.current = posts;

  useEffect(() => {
    retrievePosts();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrievePosts = () => {
    PostDataService.getAll()
      .then((response) => {
        setPosts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrievePosts();
  };

  const removeAllPosts = () => {
    PostDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    PostDataService.findByTitle(searchTitle)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openPost = (rowIndex) => {
    const id = postsRef.current[rowIndex].id;

    props.history.push("/posts/" + id);
  };

  const deletePost = (rowIndex) => {
    const id = postsRef.current[rowIndex].id;

    PostDataService.remove(id)
      .then((response) => {
        props.history.push("/posts");

        let newPosts = [...postsRef.current];
        newPosts.splice(rowIndex, 1);

        setPosts(newPosts);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Status",
        accessor: "published",
        Cell: (props) => {
          return props.value ? "Published" : "Pending";
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <button onClick={() => openPost(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </button>

              <button onClick={() => deletePost(rowIdx)}>
                <i className="fas fa-trash action"></i>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: posts,
  });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllPosts}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default PostsList;
