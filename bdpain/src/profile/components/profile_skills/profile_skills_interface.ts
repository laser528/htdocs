export interface ProfileSkillsProps {
  skills: string[];
  isEditable: boolean;

  // Refresh Profile Parent.
  //onAboutComplete: (about: string) => void;
}

export interface ProfileSkillsState {
  skills: string[];
}

export interface ProfileSkillsController {
  skillsFormat: (skill: string) => string;
  //   onAboutChange: () => void;
  //   onButtonClick: () => void;
  //   onButtonClose: () => void;
}
