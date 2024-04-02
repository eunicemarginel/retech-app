// Profile.js
import { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import UserContext from '../UserContext';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';

export default function Profile() {
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({});

    useEffect(() => {
        fetch(`http://localhost:4000/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (typeof data.user._id !== "undefined") {
                    setDetails(data.user);
                } else if (data.error === "User not found") {
                    Swal.fire({
                        title: "User not found",
                        icon: "error",
                        text: "Something went wrong, kindly contact us for assistance."
                    });
                } else {
                    Swal.fire({
                        title: "Something went wrong",
                        icon: "error",
                        text: "Something went wrong, kindly contact us for assistance."
                    });
                }
            });
    }, []);

    // Function to handle profile update
    const handleUpdateProfile = (updatedDetails) => {
        fetch(`http://localhost:4000/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedDetails)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data._id) {
                Swal.fire({
                    title: "Profile Updated",
                    icon: "success",
                    text: "Your profile has been updated successfully."
                });
                // Optionally update the profile details displayed on the page
                setDetails(data); // Assuming the server returns the updated user details
            } else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: data.message || "Something went wrong, please try again."
                });
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Something went wrong, please try again."
            });
        });
    };

    return (
        (user.id === null) ?
            <Navigate to="/products" /> :
            <>
                <Row>
                    <Col className="p-5 bg-primary text-white">
                        <h1 className="my-5">Profile</h1>
                        <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
                        <hr />
                        <h4>Contacts</h4>
                        <ul>
                            <li>Email: {details.email}</li>
                            <li>Mobile No: {details.mobileNo}</li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResetPassword />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <UpdateProfile onUpdateProfile={handleUpdateProfile} />
                    </Col>
                </Row>
            </>
    );
}
