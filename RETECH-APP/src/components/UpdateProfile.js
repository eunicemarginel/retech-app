import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function UpdateProfile({ onUpdateProfile }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNo, setMobileNo] = useState('');

    const handleUpdate = () => {
        // Create an object with updated details
        const updatedDetails = {
            firstName,
            lastName,
            mobileNo
        };

        // Call the parent function to handle profile update
        onUpdateProfile(updatedDetails);

        // Optionally, you can clear the form fields after submission
        setFirstName('');
        setLastName('');
        setMobileNo('');
    };

    return (
        <div className="my-4">
            <h4>Update Profile</h4>
            <Form>
                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formMobileNo">
                    <Form.Label>Mobile No</Form.Label>
                    <Form.Control type="text" placeholder="Enter mobile number" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Form>
        </div>
    );
}
