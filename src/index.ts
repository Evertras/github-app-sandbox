import {Probot} from "probot";

export = (app: Probot) => {
  // Issue ignoring feature
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Hello from Everbot!  We got your issue, and we're now completely ignoring it.",
    });
    await context.octokit.issues.createComment(issueComment);

    const issueLabel = context.issue({
      labels: [
        "ignored"
      ],
    });

    await context.octokit.issues.addLabels(issueLabel);
  });

  // Get a CI file feature
  app.on("push", async (context) => {
    const gitignoreRequest = context.repo({path: ".my-ci.yaml"});

    const response = await context.octokit.repos.getContent(gitignoreRequest);

    const data = response.data;

    // TODO: https://github.com/octokit/types.ts/issues/56 is a little confusing
    // but we should be able to avoid the 'any' here :/
    const contents = Buffer.from((<any>data).content, "base64").toString("ascii");

    // Print out the contents for now just to show that we got them
    context.log(contents);
  });

  // Run linting feature
  app.on("check_suite.requested", async (context) => {
    const run = context.repo({name: "simple-lint", head_sha: context.payload.check_suite.head_sha});
    const created = await context.octokit.checks.create(run);

    // This is a super long example just for funsies to play with images/annotations,
    // the actual code would be pretty tiny here.
    const completed = context.repo({
      check_run_id: created.data.id,
      status: "completed",
      conclusion: "success",
      output: {
        title: "Lint Result",
        summary: `
        Linting was fine!  But let's add an annotation somewhere to try it out.

        Anyway here's a kitten.
        `,
        images: [
          {
            alt: "placekitten",
            image_url: "https://placekitten.com/g/200/300",
            caption: "Aww",
          },
        ],
        annotations: [
          {
            path: "README.md",
            annotation_level: "notice",
            start_line: 3,
            end_line: 5,
            title: "Hey",
            message: "These are lines 3-5, in case you were wondering",
          },
        ],
      },
    });

    await context.octokit.checks.update(completed);
  });
};
