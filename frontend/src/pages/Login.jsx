import { Button, Container, Form } from 'react-bootstrap';
import useAuth from '../hooks/useAuth'

export default function Login(){
    const {login} = useAuth();

    function handleSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);
        login({
            email: podaci.get('email'),
            password: podaci.get('lozinka'),
        })
    }

    return (
        <Container>
            <p>
                email: ivan.steko5@gmail.com
            </p>
            <p>
                password: edunovawp8
            </p>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type='text'
                    name='email'
                    placeholder='ime.prezime@email.com'
                    maxLength={255}
                    required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='lozinka'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type='password'
                    name='lozinka'
                    required
                    />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    Authorize
                </Button>
            </Form>
        </Container>
    )
}