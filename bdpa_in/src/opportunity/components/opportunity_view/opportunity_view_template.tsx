import React from "react";
import ReactMarkdown from "react-markdown";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import remarkGfm from "remark-gfm";
import "./opportunity_view.scss";
import {
  OpportunityViewController,
  OpportunityViewProps,
  OpportunityViewState,
} from "./opportunity_view_interface";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import Modal from "react-bootstrap/Modal";

export function template(
  this: OpportunityViewController,
  props: OpportunityViewProps,
  state: OpportunityViewState
) {
  return !state?.opportunity ? (
    <Spinner />
  ) : (
    <>
      <Card className="card border-0 mb-5">
        {state.canModifyOpportunity && (
          <div className="d-flex justify-content-end">
            <Button
              variant="warning"
              onClick={this.onEditButtonClick}
              className="me-2"
            >
              Edit
              <i className="fa fa-pencil ms-2" />
            </Button>
            <Button variant="danger" onClick={this.onDeleteButtonClick}>
              Delete
              <i className="fa fa-close ms-2" />
            </Button>
          </div>
        )}
        <Card.Title as="h3" className="text-center mb-4">
          {state.opportunity.title}
        </Card.Title>
        <Card.Body className="px-4 py-2">
          <span className="d-block mb-2">
            <Card.Text className="d-inline me-1 fw-bold">Created:</Card.Text>
            <Card.Text className="d-inline me-1 text-muted">
              {new Date(Number(state.opportunity.createdAt)).toLocaleString()}
            </Card.Text>
          </span>
          <span className="d-block mb-2">
            <Card.Text className="d-inline me-1 fw-bold">Viewed:</Card.Text>
            <Card.Text className="d-inline me-1 text-muted">
              {state.opportunity.views} Times
            </Card.Text>
            <Card.Text className="d-inline me-1 fw-bold">·</Card.Text>
            <Card.Text className="d-inline me-1 fw-bold">
              Active Viewers:
            </Card.Text>
            <Card.Text className="d-inline me-1 text-muted">
              {state.opportunity.activeViewers ?? 0} Viewing
            </Card.Text>
          </span>
          <span className="d-block mb-2 small">
            <Card.Text className="d-inline me-1 fw-bold text-muted">
              Last Updated:
            </Card.Text>
            <Card.Text className="d-inline me-1">
              {new Date(Number(state.opportunity.updatedAt)).toLocaleString()}
            </Card.Text>
          </span>
          <ReactMarkdown
            children={state.opportunity.contents ?? ""}
            remarkPlugins={[remarkGfm]}
          />
        </Card.Body>
      </Card>

      <Modal
        show={state.showEditModal}
        onHide={this.onEditModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="edit-opportunity"
        centered={true}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="edit-opportunity">Edit Opportunity</Modal.Title>
        </Modal.Header>
        <Form
          className="form-floating mb-3"
          id="editForm"
          onSubmit={this.handleEditSubmit}
        >
          <Modal.Body>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                maxLength={100}
                value={state.modalTitle ?? ""}
                onChange={this.onModalTitleChange}
                required
              />
              <Form.Label htmlFor="title">Title</Form.Label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                rows={50}
                id="contents"
                name="contents"
                placeholder="Contents"
                maxLength={3000}
                value={state.modalContents ?? ""}
                onChange={this.onModalContentsChange}
                required
              />
              <Form.Label htmlFor="contents">Contents</Form.Label>
            </Form.Floating>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="primary"
              className="btn-login text-uppercase fw-bold"
            >
              Submit {state.showEditSpinner ? <Spinner /> : null}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
