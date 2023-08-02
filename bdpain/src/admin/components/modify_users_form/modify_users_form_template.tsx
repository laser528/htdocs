import {
  ModifyUsersFormController,
  ModifyUsersFormProps,
  ModifyUsersFormState,
} from "./modify_users_form_interface";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import Modal from "react-bootstrap/Modal";

export function template(
  this: ModifyUsersFormController,
  props: ModifyUsersFormProps,
  state: ModifyUsersFormState
) {
  return (
    <Modal
      show
      onHide={props.onComplete}
      dialogClassName="modal-90w"
      aria-labelledby="modify-users"
      centered={true}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modify-users">
          {!props.user ? "Add User" : "Modify User"}
        </Modal.Title>
      </Modal.Header>
      <Form className="form-floating mb-3" onSubmit={this.onModifyFormSubmit}>
        <Modal.Body>
          <Form.Floating className="mb-3">
            <Form.Select id="type" name="type" required>
              {this.promotions.map((type, index) => {
                return (
                  <option value={type} selected={!index} key={type}>
                    {type.toLocaleUpperCase()}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Label htmlFor="type">Type</Form.Label>
          </Form.Floating>
          {!props.user && (
            <>
              <Form.Floating className={"mb-3"}>
                <Form.Control
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  pattern="[a-zA-Z0-9_\-]*"
                  title="Username can only contain Alphanumeric Characters. Dashes and Underscores are allowed."
                  value={state.username}
                  onChange={this.onUsernameChange}
                  required
                />
                <Form.Label htmlFor="username">Username</Form.Label>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="E-mail Address"
                  value={state.email}
                  onChange={this.onEmailChange}
                  required
                />
                <Form.Label htmlFor="email">E-mail Address</Form.Label>
              </Form.Floating>
              {!props.user && (
                <Form.Floating className={"mb-3"}>
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={this.onPasswordChange}
                    required
                  />
                  <Form.Label htmlFor="password">Password</Form.Label>
                  {state.password && (
                    <ProgressBar
                      striped
                      animated
                      variant={this.passwordStrength.class}
                      label={this.passwordStrength.variant}
                      now={100}
                      className={`mb-3`}
                    />
                  )}
                </Form.Floating>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            className="text-uppercase fw-bold"
          >
            Submit {state.showSpinner ? <Spinner /> : null}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
