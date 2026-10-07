import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

export default defineMarkdocConfig({
    extends: [
        shiki({
            theme: "github-dark",
            wrap: true,
        }),
    ],
    nodes: {
        document: {
            ...nodes.document,
            render: null,
        },
        image: {
            ...nodes.image,
            render: component("./src/components/common/MarkdocImage.astro"),
        },
    },
});
