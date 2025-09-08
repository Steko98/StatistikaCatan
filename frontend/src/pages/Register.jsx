import { useNavigate } from "react-router-dom";
import useError from "../hooks/useError";
import useLoading from "../hooks/useLoading";
import AuthService from "../services/AuthService";
import { RouteNames } from "../constants";
import { Container, Button, Form } from "react-bootstrap";


export default function Register(){
    const navigate = useNavigate();
    const {showLoading, hideLoading} = useLoading();
    const {prikaziError} = useError();

    async function registriraj(e){
        showLoading();
        const odgovor = await AuthService.registerService(e)
        hideLoading();
            if (odgovor.greska) {
                prikaziError(odgovor.poruka)
                return
            }
        navigate(RouteNames.LOGIN)
    }
    
    function handleSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);
        registriraj({
            email: podaci.get("email"),
            password: podaci.get("lozinka"),
        })
    }

    return (
        <Container>
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
                    Register
                </Button>
            </Form>
        </Container>
    )
}