import {
  ModifyUsersController,
  ModifyUsersProps,
  ModifyUsersState,
} from "./modify_users_interface";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { ModifyUsersForm } from "../modify_users_form/modify_users_form";

export function template(
  this: ModifyUsersController,
  props: ModifyUsersProps,
  state: ModifyUsersState
) {
  return (
    <Container>
      {state.showModal && (
        <ModifyUsersForm
          user={state.userSpotlighted}
          onComplete={this.onButtonClose}
        />
      )}
      <Card.Title className="mt-3">Modify Users</Card.Title>
      <Row className="col-8">
        <div className="d-flex justify-content-end">
          <Button variant="success" onClick={this.onButtonClick()}>
            Add New User
            <i className="fa fa-plus ms-2" />
          </Button>
        </div>
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Current Application Users
        </Card.Title>
        {!state.users.length ? (
          <Spinner />
        ) : (
          <Card.Body className="px-4 py-2">
            <ListGroup>
              <InfiniteScroll
                dataLength={state.usersSliced.length}
                next={this.fetchUsersFeed}
                hasMore={state.hasMoreItems}
                loader={<Spinner />}
                height={500}
              >
                {state.usersSliced.map((item, index) => (
                  <ListGroupItem
                    onClick={this.onButtonClick(item)}
                    key={`users-${index}`}
                    style={{ cursor: "grab" }}
                  >
                    {item.username}
                  </ListGroupItem>
                ))}
              </InfiniteScroll>
            </ListGroup>
          </Card.Body>
        )}
      </Row>
    </Container>
  );
}
