import React from "react";
import {
  ProfileController,
  ProfileProps,
  ProfileState,
} from "./profile_interface";
import Col from "react-bootstrap/Col";
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
      {(!!state.profile?.about || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileAbout
            isEditable={this.isEditable}
            about={state.profile?.about ?? ""}
          />
        </Col>
      )}
      {(!!state.profile?.experience?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Experience"
            section={state.profile?.experience}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.education?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Education"
            section={state.profile?.education}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.volunteering?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileDetailedSection
            sectionTitle="Volunteering"
            section={state.profile?.volunteering}
            isEditable={this.isEditable}
          />
        </Col>
      )}
      {(!!state.profile?.skills?.length || this.isEditable) && (
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <ProfileSkills
            skills={state.profile?.skills ?? []}
            isEditable={this.isEditable}
          />
        </Col>
      )}
    </Stack>
  );
}
