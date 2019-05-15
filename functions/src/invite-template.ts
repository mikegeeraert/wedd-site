export function renderInviteBody(householdId: string, email: string): string {
  return `<h1>HELLO</h1>
          <a href="https://geeraertwedding.ca/authenticate?email=${email}&householdId=${householdId}">Click here</a>`;
}
