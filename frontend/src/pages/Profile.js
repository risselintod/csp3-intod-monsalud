import { useContext } from "react"
import UserContext from "../context/UserContext"

export default function Profile() {
    const { user } = useContext(UserContext);
    console.log("User Profile: ", user);
    

    return (
        <h1>PROFILE</h1>
    )
}