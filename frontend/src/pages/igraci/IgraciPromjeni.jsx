import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Form, Container, Image } from "react-bootstrap";
import IgracService from "../../services/IgracService";
import { BACKEND_URL, RouteNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import { TbArrowBackUp } from "react-icons/tb";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import profilna from "../../assets/profilna.svg";

export default function IgraciPromjena() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [igrac, setIgrac] = useState({});

  const [trenutnaSlika, setTrenutnaSlika] = useState("");
  const [slikaZaCrop, setSlikaZaCrop] = useState("");
  const [slikaZaServer, setSlikaZaServer] = useState("");
  const cropperRef = useRef(null);

  async function dohvatiIgrac() {
    showLoading();
    const odgovor = await IgracService.getBySifra(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setIgrac(odgovor.poruka);

    if (odgovor.poruka.slika != null) {
      setTrenutnaSlika(BACKEND_URL + odgovor.poruka.slika + `?${Date.now()}`);
    } else {
      setTrenutnaSlika(profilna);
    }
  }

  useEffect(() => {
    dohvatiIgrac();
  }, []);

  async function promjeni(igrac) {
    showLoading();
    const odgovor = await IgracService.promjeni(routeParams.sifra, igrac);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    promjeni({
      ime: podaci.get("ime"),
    });

    navigate(-1);
  }

  function onCrop() {
    setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas({maxWidth: 512, maxHeight: 512, imageSmoothingEnabled: true, imageSmoothingQuality: 'high'}).toDataURL());
  }

  function onChangeImage(e) {
    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img')
      img.onload = () => {
        let maxDimension = 1024
        let largerDimension = 0
        if (img.height > img.width) {
          largerDimension = img.height
        } else {
          largerDimension = img.width
        }
        let scaleFactor = 0
        if (largerDimension < maxDimension) {
          scaleFactor = 1
        } else {
          scaleFactor = maxDimension / largerDimension
        }
        let canvasHeight = img.height * scaleFactor
        let canvasWidth = img.width * scaleFactor

        const canvas = document.createElement('canvas')
        canvas.width = Math.round(canvasWidth)
        canvas.height = Math.round(canvasHeight)

        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, canvasWidth, canvasHeight)

        const base64 = canvas.toDataURL()
        setSlikaZaCrop(base64)
      }
      img.src = reader.result
    };
    try {
      reader.readAsDataURL(files[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async function spremiSliku() {
    showLoading();
    const base64 = slikaZaServer;
    const odgovor = await IgracService.postaviSliku(routeParams.sifra, {
      Base64: base64.replace("data:image/png;base64,", ""),
    });
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.podaci);
    }
    setTrenutnaSlika(slikaZaServer);
  }

  return (
    <Container>
      <h2 className="sredina headers">Edit player</h2>

      <Form onSubmit={obradiSubmit}>
        <Link to={-1} className="btn btn-danger">
          <TbArrowBackUp /> Return
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="success" type="submit">
          Save changes
        </Button>
        <hr />
        <Row className="mb-4">
          <Col key="1" sm={12} md={4} lg={3}>
            <Form.Group controlId="ime">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="ime"
                required
                defaultValue={igrac.ime}
              />
            </Form.Group>
          </Col>
          <Col key="2" sm={12} md={4} lg={6}>
            <p className="form-label">Current profile picture</p>
            <Image
              src={trenutnaSlika}
              className="slika"
              style={{ maxWidth: "400px" }}
            />
          </Col>
          <Col key="3" sm={12} md={4} lg={3}>
            {slikaZaServer && (
              <>
                <p className="form-label">New picture</p>
                <Image src={slikaZaServer || slikaZaCrop} className="slika" />
              </>
            )}
          </Col>
        </Row>
      </Form>
      <input className="mb-3" type="file" onChange={onChangeImage} />
      <Button disabled={!slikaZaServer} onClick={spremiSliku}>
        Save new picture
      </Button>
      <Cropper
        src={slikaZaCrop}
        style={{ height: 400, width: "100%" }}
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
        ref={cropperRef}
      />
    </Container>
  );
}
