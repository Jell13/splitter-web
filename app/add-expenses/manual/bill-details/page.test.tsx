import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import BillDetailsPage from "./page";
import userEvent from "@testing-library/user-event";
import { useManualStore } from "@/app/stores/manual-bill";

vi.mock("@/app/stores/manual-bill", () => ({
    useManualStore: vi.fn()
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn()
    })
}))

const mockState = {
    description: "",
    subtotal: 0,
    tip: 0,
    tax: 0,
    hasHydrated: true,
    guestCount: 0,
    setGuestCount: vi.fn(),
    setHasHydrated: vi.fn(),
    setDescription: vi.fn(),
    setSubtotal: vi.fn(),
    setTip: vi.fn(),
    setTax: vi.fn(),
    reset: vi.fn()
}

beforeEach(() => {

    mockState.description = "";
    mockState.subtotal = 0;
    mockState.tax = 0;
    mockState.tip = 0;
    mockState.hasHydrated = true;
    vi.mocked(useManualStore).mockImplementation((selector) => selector(mockState))
})

describe("BillsDetailsPage", () => {

    it("Render the bill details page", () => {

        mockState.description = "In n Out";
        mockState.subtotal = 100;
        mockState.tip = 10;
        render(<BillDetailsPage/>)

        expect(screen.getByPlaceholderText("Real Seafood Co.")).toBeInTheDocument();
        const descriptionInput = screen.getByDisplayValue("In n Out");
        expect(descriptionInput).toBeInTheDocument();
    })

    it("Check if the render is null if its hydrated", () => {
        mockState.hasHydrated = false;

        const { container } = render(<BillDetailsPage/>);

        expect(container).toBeEmptyDOMElement();
    })

    it("Testing the input stuff", () => {
        mockState.description = "In n Out";
        mockState.subtotal = 100;
        mockState.tip = 0;
        mockState.tax = 10;

        render(<BillDetailsPage/>);
        
        const inputDescription = screen.getByLabelText("Description");
        expect(inputDescription).toHaveValue("In n Out");

        const inputSubtotal = screen.getByLabelText("Subtotal");
        expect(inputSubtotal).toHaveValue("100");

        const inputTip = screen.getByLabelText("Tip");
        expect(inputTip).toHaveValue("");
    })

    test("Testing the user inputting stuff", async () => {

        const user = userEvent.setup();
        render(<BillDetailsPage/>);

        const inputDescription = screen.getByLabelText("Description");
        await user.type(inputDescription, "Chick Fill A");
        expect(inputDescription).toHaveValue("Chick Fill A");
    })
})