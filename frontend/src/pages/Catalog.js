import { Col, Container, Row, Card, Button } from "react-bootstrap";

export default function Catalog() {

    

    return (
        <Container className="p-5 bg-info m-5">
            <h1 className="text-center pb-3">Products</h1>
            <Row className="mx-auto">
                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

             <Row className="mx-auto mt-4">
                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="p-5">
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Product Title</Card.Title>
                            <Card.Text>Product Description</Card.Text>
                            <Button variant="primary" className="px-5">Buy</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}