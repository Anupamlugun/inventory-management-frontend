import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  ListGroup,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  { text: "Dashboard", path: "/" },
  { text: "Category", path: "/category" },
  { text: "Product", path: "/product" },
  { text: "Supplier", path: "/supplier" },
  { text: "Purchase Product", path: "/purchase-product" },
  { text: "Sale Product", path: "/sale-product" },
  { text: "Purchase Report", path: "/purchase-report" },
  { text: "Sale Report", path: "/sale-report" },
  { text: "Stock", path: "/stock" },
];

const Layout = () => {
  const { accesstoken } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { handleLogout } = useAuth();

  const location = useLocation();
  return (
    <div className="d-flex flex-column vh-100">
      {/* Sticky Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="px-3 shadow-sm sticky-top"
        style={{ zIndex: 1030 }} // Higher than sidebar's z-index
      >
        <div className="d-flex align-items-center">
          {accesstoken && (
            <Button
              variant="link"
              className="text-light d-lg-none me-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </Button>
          )}
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            Inventory System
          </Navbar.Brand>
        </div>

        <div id="logout-nav" className="justify-content-end">
          <Nav>
            {accesstoken ? (
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="d-flex align-items-center gap-2"
              >
                <FiLogOut /> Logout
              </Button>
            ) : (
              <Button variant="outline-light" as={Link} to="/login">
                Login
              </Button>
            )}
          </Nav>
        </div>
      </Navbar>

      <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
        {accesstoken && (
          <>
            {/* Sticky Desktop Sidebar */}
            <div
              className="d-none d-lg-block sidebar bg-white border-end shadow-sm sticky-top"
              style={{
                width: "240px",
                zIndex: 1020,
                height: "calc(100vh - 72px)",
              }}
            >
              <ListGroup variant="flush" className="p-3">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <ListGroup.Item
                      key={item.text}
                      action
                      as={Link}
                      to={item.path}
                      className={`rounded mb-1 border-0 text-dark hover-primary ${
                        isActive ? "linkactive" : ""
                      }`}
                    >
                      {item.text}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>

            {/* Mobile Offcanvas */}
            <Offcanvas
              show={sidebarOpen}
              onHide={() => setSidebarOpen(false)}
              className="d-lg-none"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="p-0">
                <ListGroup variant="flush">
                  {menuItems.map((item) => (
                    <ListGroup.Item
                      key={item.text}
                      action
                      as={Link}
                      to={item.path}
                      className="rounded-0 border-start-0 border-end-0 hover-primary"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.text}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        )}

        {/* Scrollable Main Content */}
        <main
          className="flex-grow-1 p-3 p-lg-4 main-content"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 72px)", // Subtract navbar height
            marginTop: "0px", // Offset for sticky navbar
          }}
        >
          <Container fluid>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Layout;
