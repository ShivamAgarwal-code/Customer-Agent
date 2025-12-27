import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const conversationId = params.id;
  return { conversationId };
};
