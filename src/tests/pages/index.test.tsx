import { render, screen } from "@testing-library/react";
import { IndexPage } from "../../pages/index";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../../config/apollo";

jest.setTimeout(30000);

describe("IndexPage", () => {
  it("should render", async () => {
    render(
      <ApolloProvider client={apolloClient}>
        <IndexPage />
      </ApolloProvider>
    );

    const photosTable = await screen.findByTestId("photos-table", undefined, {
      timeout: 5000,
    });
    expect(photosTable).toBeInTheDocument();
  });

  it("should load more photos when change page", async () => {
    render(
      <ApolloProvider client={apolloClient}>
        <IndexPage />
      </ApolloProvider>
    );

    await screen.findByTestId("photos-table", undefined, {
      timeout: 5000,
    });

    const thumbnailId6Before = screen.queryByTestId("thumbnail-6");
    expect(thumbnailId6Before).not.toBeInTheDocument();

    const nextPageButton = await screen.findByLabelText("Go to next page");
    nextPageButton.click();

    const thumbnailId6After = await screen.findByTestId("thumbnail-6");
    expect(thumbnailId6After).toBeInTheDocument();
  });

  it("can click on thumbnail to open modal with detail picture", async () => {
    render(
      <ApolloProvider client={apolloClient}>
        <IndexPage />
      </ApolloProvider>
    );

    await screen.findByTestId("photos-table", undefined, {
      timeout: 5000,
    });

    const thumbnailId1 = await screen.findByTestId("thumbnail-1");
    thumbnailId1.click();

    const photoDetailModal = await screen.findByTestId("photo-detail-modal");
    expect(photoDetailModal).toBeInTheDocument();

    const photoDetailModalImage = await screen.findByTestId(
      "photo-detail-modal-image"
    );
    expect(photoDetailModalImage).toBeInTheDocument();
  });
});
