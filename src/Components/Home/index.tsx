import React from "react";
import { db } from "../../Firebase";
import { withAuthorization } from "../../Firebase/withAuthorization";

class HomeComponent extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      users: null
    };
  }

  public componentDidMount() {
    // db.getUsers().then(snapshot =>
    //   this.setState(() => ({ users: snapshot.val() }))
    // );
  }

  public render() {
    return (
      <div>
        <h2>Home Page</h2>
        <p>The Home Page is accessible by every signed in user.</p>
      </div>
    );
  }
}

const authCondition = (authUser: any) => { console.log(authUser); return !!authUser} ;

export const Home = withAuthorization(authCondition)(HomeComponent);
