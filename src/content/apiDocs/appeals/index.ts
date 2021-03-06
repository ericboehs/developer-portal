import { IApiCategoryContent } from '../../../apiDefs/schema';
import AppealsIntro from './appealsIntro.mdx';
import AppealsOverview from './appealsOverview.mdx';
import AppealsStatusReleaseNotes from './appealsStatusReleaseNotes.mdx';
import DecisionReviewReleaseNotes from './decisionReviewReleaseNotes.mdx';

const appealsContent: IApiCategoryContent = {
  intro: AppealsIntro,
  overview: AppealsOverview,
  placardText: 'Build tools to help Veterans electronically manage, submit, and track appeals.',
  shortDescription:
    'Enables managing benefit decision appeals on behalf of a Veteran.',
};

export {
  appealsContent,
  AppealsStatusReleaseNotes,
  DecisionReviewReleaseNotes,
};