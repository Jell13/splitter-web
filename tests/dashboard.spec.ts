import { test, expect, Page } from "@playwright/test";

const enterNameAndContinue = async (page: Page) => {
  const input = page.getByRole("textbox", { name: "Your name" });
  await input.pressSequentially("Jason Sugiharto");
  await page.getByRole("button", { name: "Continue" }).click();
};

const routeToManual = async (page: Page) => {
    await enterNameAndContinue(page);

    const addButton = page.getByRole("button", { name: "Add expense"});
    await addButton.click();

    const manualButton = page.getByRole("button", { name: "Enter manually" });
    await manualButton.click();
}

test("User can input their name into the input box to know what to call them", async ({
  page,
}) => {
  await page.goto("/");

  const input = page.getByRole("textbox", { name: "Your name" });
  await expect(page.getByText("What should we call")).toBeVisible();
  await expect(input).toBeVisible();
  await expect(input).toBeEditable();
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();

  await input.pressSequentially("Jason Sugiharto");
  await expect(input).toHaveValue("Jason Sugiharto");
  await page.getByRole("button", { name: "Continue" }).click();

});

test("User can navigate to the add screens", async ({ page }) => {
  await page.goto("/");
  await enterNameAndContinue(page);

  const addButton = page.getByRole("button", { name: "Add expense" });
  await expect(addButton).toBeVisible();
  await addButton.click();

  await expect(
    page.getByRole("button", { name: "Scan receipt" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Choose photo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enter manually" }),
  ).toBeVisible();
});

test("Route to manual and add", async({page}) => {

    await page.goto("/")
    await routeToManual(page);

    await page.getByLabel("Description").pressSequentially("In n Out");
    await page.getByLabel("Subtotal").pressSequentially("32.65");
    // await page.getByRole("textbox", { name: ""})
    await page.getByRole("button", { name: "Continue"}).click();
})