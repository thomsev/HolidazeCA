import React from 'react';
import { Container, Row, Col, Image} from 'react-bootstrap';
import heroImage from '../../assets/images/holidaze.jpeg';
import './About.css';

const About = () => {
  return (
    <Container className="about-page-container my-5">
      {/* Hero Section */}
      <Row className="about-page-hero-row align-items-center mb-4">
        <Col>
        <Image src={heroImage} alt="Holidaze Destination" className="about-page-hero-image" />
        </Col>
      </Row>

      {/* Content Sections */}
      <Row>
        <Col md={12}>
          <h2 className="text-center mb-4">Our Mission</h2>
          <p>
            Holidaze is dedicated to helping you discover the world's hidden gems for your events and getaways. Our curated selection of venues ensures unique experiences tailored to your desires.
          </p>
        </Col>
      </Row>
      
      {/* Team Section */}
      <Row>
        <Col md={12}>
          <h3 className="text-center mb-4">Meet the Team</h3>
          {/* Iterate over team members and create cards/profiles */}
        </Col>
      </Row>
      
      {/* Testimonials or Gallery */}
      <Row>
        <Col md={12}>
          <h3 className="text-center mb-4">Customer Stories</h3>
          {/* Carousel or grid of customer testimonials or images */}
        </Col>
      </Row>
    </Container>
  );
};

export default About;
