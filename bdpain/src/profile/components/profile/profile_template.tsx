import React from "react";
import {
  ProfileController,
  ProfileProps,
  ProfileState,
} from "./profile_interface";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { ProfileAbout } from "../profile_about/profile_about";
import { ProfileSkills } from "../profile_skills/profile_skills";
import { ProfileTop } from "../profile_top/profile_top";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import { ProfileDetailedSection } from "../profile_detailed_section/profile_education/profile_detailed_section";

export function template(
  this: ProfileController,
  props: ProfileProps,
  state: ProfileState
) {
  return !state.profile ? (
    <Spinner />
  ) : (
    <Stack className="gap-1 my-2">
      <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <ProfileTop isEditable={this.isEditable} user={state.profile.user} />
      </Col>
      {(!!state.profile?.sections?.about || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileAbout
            isEditable={this.isEditable}
            about={state.profile.sections.about ?? ""}
          />
        </Col>
      )}
      {(!!state.profile?.sections?.experience?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Experience"
            section={state.profile?.sections?.experience}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.sections?.education?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Education"
            section={state.profile?.sections?.education}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.sections?.volunteering?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Volunteering"
            section={state.profile?.sections?.volunteering}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.sections?.skills?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileSkills
            skills={state.profile?.sections?.skills ?? []}
            isEditable={this.isEditable}
          />
        </Col>
      )}
    </Stack>
  );
}
