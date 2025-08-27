import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Form, Container, Image } from "react-bootstrap";
import IgracService from "../../services/IgracService";
import { BACKEND_URL, RouteNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css'
import profilna from '../../assets/profilna.png'

export default function IgraciPromjena() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [igrac, setIgrac] = useState({});

  const [trenutnaSlika, setTrenutnaSlika] = useState('')
  const [slikaZaCrop, setSlikaZaCrop] = useState('')
  const [slikaZaServer, setSlikaZaServer] = useState('')
  const cropperRef = useRef(null)

  async function dohvatiIgrac() {
    showLoading()
    const odgovor = await IgracService.getBySifra(routeParams.sifra);
    hideLoading()
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setIgrac(odgovor.poruka);

    if (odgovor.poruka.slika!=null) {
      setTrenutnaSlika(BACKEND_URL + odgovor.poruka.slika + `${Date.now()}`)
    } else {
      setTrenutnaSlika(profilna)
    }
  }

  useEffect(() => {
    dohvatiIgrac();
  }, []);

  async function promjeni(igrac) {
    showLoading()
    const odgovor = await IgracService.promjeni(routeParams.sifra, igrac);
    hideLoading()
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.IGRACI_PREGLED);
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    promjeni({
      ime: podaci.get("ime"),
    });
  }

  function onCrop(){
    setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas().toDataURL())
  }

  function onChangeImage(e){
    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target){
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSlikaZaCrop(reader.result);
    };
    try {
      reader.readAsDataURL(files[0]);
    } catch (error) {
      console.error(error)
    }
  }

  async function spremiSliku() {
    showLoading();
    const base64 = slikaZaServer;
    const odgovor = await IgracService.postaviSliku(routeParams.sifra, {Base64: base64.replace('data:image/png;base64', '')});
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.podaci)
    }
    setTrenutnaSlika(slikaZaServer)
  }

  return (
    <Container>
      <h2 className="sredina">Uređivanje igrača</h2>

      <hr />
      <Form onSubmit={obradiSubmit}>
        <Row className="mb-4">
          <Col key='1' sm={12} md={4} lg={3}>
            <Form.Group controlId="ime">
              <Form.Label>Ime</Form.Label>
              <Form.Control
                type="text"
                name="ime"
                required
                defaultValue={igrac.ime}
              />
            </Form.Group>
          </Col>
          <Col key='2' sm={12} md={4} lg={6}>
            <p className="form-label">Trenutna slika</p>
            <Image
            src={trenutnaSlika}
            className="slika"
            style={{maxWidth:'400px'}}
            />
          </Col>
          <Col key='3' sm={12} md={4} lg={3}>
            {slikaZaServer && (
              <>
                <p className="form-label">Nova slika</p>
                <Image
                src={slikaZaServer || slikaZaCrop}
                className="slika"
                />
              </>
            )}
          </Col>
          </Row>
        </Form>
        <input className="mb-3" type="file" onChange={onChangeImage}/>
        <Button disabled={!slikaZaServer} onClick={spremiSliku}>Spremi sliku</Button>
        <Cropper
          src={slikaZaCrop}
          style={{height: 400, width: '100%'}}
          initialAspectRatio={1}
          guides={true}
          minCropBoxWidth={50}
          minCropBoxHeight={50}
          cropBoxResizable={true}
          background={false}
          responsive={true}
          checkOrientation={false}
          cropstart={onCrop}
          cropend={onCrop}
          ref={cropperRef}/>

      <hr />

        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.IGRACI_PREGLED} className="btn btn-danger siroko">
              Povratak
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">
              Promjeni igrača
            </Button>
          </Col>
        </Row>
      
    </Container>
  );
}
