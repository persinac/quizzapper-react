import React from "react";
import {db, firebase} from "./index";
import { authUserContext } from "./AuthUserContext";

interface InterfaceProps {
    authUser?: any;
}

interface InterfaceState {
    authUser?: any;
}

export const withAuthentication = (Component: any) => {
    class WithAuthentication extends React.Component<
        InterfaceProps,
        InterfaceState
        > {
        constructor(props: any) {
            super(props);

            this.state = {
                authUser: null
            };
        }

        public componentDidMount() {
            firebase.auth.onAuthStateChanged(authUser => {
                authUser ?
                    db
                        .getUserById(authUser.uid)
                        .then(snapshot => {
                            const dbUser = snapshot.val();
                            // default empty roles
                            if(dbUser !== undefined && dbUser !== null) {
                                if (!dbUser.roles) {
                                    dbUser.roles = {};
                                }
                                // merge auth and db user
                                authUser = {
                                    uid: authUser.uid,
                                    email: authUser.email,
                                    roles: dbUser.roles,
                                    ...dbUser
                                };
                                this.setState({authUser: authUser});
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                    : this.setState({authUser: null})
            });
        }

        public render() {
            const { authUser } = this.state;
            return (
                <authUserContext.Provider value={authUser}>
                    <Component />
                </authUserContext.Provider>
            );
        }
    }
    return WithAuthentication;
};
