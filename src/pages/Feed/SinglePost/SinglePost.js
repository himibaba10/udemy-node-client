import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          getPost(postId: "${postId}") {
            _id
            title
            content
            imageUrl
            creator { name }
            createdAt
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData.errors);
        if (resData.errors && resData.errors[0].statusCode === 400) {
          throw new Error("Validation failed.");
        }
        if (resData.errors) {
          throw new Error("Login failed.");
        }

        this.setState({
          title: resData.data.getPost.title,
          author: resData.data.getPost.creator.name,
          date: new Date(resData.data.getPost.createdAt).toLocaleDateString(
            "en-US"
          ),
          image: `http://localhost:8080/${resData.data.getPost.imageUrl}`,
          content: resData.data.getPost.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
