import { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import { Notyf } from 'notyf';

export default function Login() {

    const notyf = new Notyf();
    const { user, setUser } = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {

        e.preventDefault();
        fetch("https://dwow4264w2.execute-api.us-west-2.amazonaws.com/production/users/login", {
        // fetch("http://localhost:4000/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access !== undefined){

                console.log("Data Access:", data.access);

                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                notyf.success('Successful Login');

            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try Again');
            } else {
                notyf.error('User Not Found. Try Again.');
            }
        })
    }

    function retrieveUserDetails(token){
        fetch('http://localhost:4000/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {

            console.log("Login User:", data);

            setUser({
              id: data._id,
              isAdmin: data.isAdmin
            });
        })
    };

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        } else { 
            setIsActive(false);
        }

    }, [email, password]);

    return (
        <Form className='p-5 m-5 bg-info' onSubmit={(e) => authenticate(e)}>
            <Row>
                <Col md="8" className='mx-auto'>
                    <h1 className='text-center my-5'>Login Form</h1>
                    <Form.Group className="pb-5">

                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter your email'
                            className='mb-3'
                            required
                            value={email}
                            onChange={e => {setEmail(e.target.value)}}
                        />

                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter your password'
                            className='mb-3'
                            required
                            value={password}
                            onChange={e => {setPassword(e.target.value)}}
                        />
                        { isActive ?
                            <Button className='mt-3 px-5' type='submit' variant='success'>Login</Button>
                        :
                            <Button className='mt-3 px-5' type='submit' variant='primary' disabled>Login</Button>
                        }
                    </Form.Group>
                
                </Col>
            </Row>
        </Form>
    )
}