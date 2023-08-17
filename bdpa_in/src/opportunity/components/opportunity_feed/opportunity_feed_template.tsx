import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "./opportunity_feed.scss";
import {
  OpportunityFeedController,
  OpportunityFeedProps,
  OpportunityFeedState,
} from "./opportunity_feed_interface";
import { OpportunityCard } from "../opportunity_card/opportunity_card";

export function template(
  this: OpportunityFeedController,
  props: OpportunityFeedProps,
  state: OpportunityFeedState
) {
  return (
    <>
      {state.canAddOpportunity && (
        <div className="d-flex justify-content-end">
          <Button variant="success" onClick={this.onAddButtonClick}>
            Add Opportunity
            <i className="fa fa-plus ms-2" />
          </Button>
        </div>
      )}
      <Card className="card border-0 mb-5">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Opportunities!
          <sub style={{ display: "block" }}>
            Available Jobs and Volunteering Roles!
          </sub>
        </Card.Title>
        {!state.opportunities.length ? (
          <Spinner />
        ) : (
          <Card.Body className="px-4 py-2">
            <InfiniteScroll
              dataLength={state.opportunitiesSliced.length}
              next={this.fetchFeed}
              hasMore={state.hasMoreItems}
              loader={<Spinner />}
              height={750}
            >
              {state.opportunitiesSliced.map((item, index) => (
                <OpportunityCard
                  className="border-bottom mb-4"
                  opportunity={item}
                  key={`opportunity-${index}`}
                />
              ))}
            </InfiniteScroll>
          </Card.Body>
        )}
      </Card>

      <Modal
        show={state.showAddModal}
        onHide={this.onAddModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="add-opportunity"
        centered={true}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-opportunity">Add Opportunity</Modal.Title>
        </Modal.Header>
        <Form
          className="form-floating mb-3"
          id="addForm"
          onSubmit={this.handleAddSubmit}
        >
          <Modal.Body>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                maxLength={100}
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
              Submit {state.showAddSpinner ? <Spinner /> : null}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
