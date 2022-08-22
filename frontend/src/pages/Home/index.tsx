import * as React from "react";
import {observer} from "mobx-react";
import {Helmet} from "react-helmet";
import {useGlobalStore} from "@store";
import {ContactsNotAvailable} from "./ContactsNotAvailable";
import {Contacts} from "./Contacts";

export default observer(function Home(): React.ReactElement {
    const {auth} = useGlobalStore();
    return (
        <>
            <Helmet>
                <title>Home - Contacts App</title>
            </Helmet>
            {auth.isAuth ? <Contacts /> : <ContactsNotAvailable />}
        </>
    );
});
