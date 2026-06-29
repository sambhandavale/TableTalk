import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewCard from "@/components/dashboard/ReviewCard";

describe("ReviewCard", () => {
  const mockReview = {
    id: "r-123",
    diner_name: "John Doe",
    visitor_type: "first-time",
    rating: 4,
    text: "Great food and ambience!",
    source: "google",
    ai_response_draft: "Thank you for the wonderful feedback!",
    ordered_items: ["Pasta", "Wine"],
    owner_approved_reply: false,
    final_reply_content: null,
  };

  it("renders reviewer name and text", () => {
    render(<ReviewCard rev={mockReview} onApprove={jest.fn()} />);
    
    expect(screen.getByText("John Doe")).toBeInDocument();
    expect(screen.getByText("Great food and ambience!")).toBeInDocument();
    expect(screen.getByText("first-time")).toBeInDocument();
  });

  it("displays ordered items", () => {
    render(<ReviewCard rev={mockReview} onApprove={jest.fn()} />);
    
    expect(screen.getByText("Pasta")).toBeInDocument();
    expect(screen.getByText("Wine")).toBeInDocument();
  });

  it("calls onApprove when approve button is clicked", async () => {
    const mockOnApprove = jest.fn().mockResolvedValue({});
    render(<ReviewCard rev={mockReview} onApprove={mockOnApprove} />);
    
    const approveBtn = screen.getByText(/Approve & Post/i);
    fireEvent.click(approveBtn);
    
    expect(mockOnApprove).toHaveBeenCalledWith("r-123", "Thank you for the wonderful feedback!");
  });
});
