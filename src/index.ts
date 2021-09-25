import {Probot} from "probot";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("push", async (context) => {
    const gitignoreRequest = context.repo({path: ".gitignore"});

    const contents = context.octokit.repos.getContent(gitignoreRequest);

    context.log(contents);
  });

  app.on("check_suite.requested", async (context) => {
    //context.log(JSON.stringify(context.payload, null, 2));
    const run = context.repo({name: "simple-lint", head_sha: context.payload.check_suite.head_sha});
    const created = await context.octokit.checks.create(run);

    const completed = context.repo({
      check_run_id: created.data.id,
      status: "completed",
      conclusion: "success",
      output: {
        title: "Lint Result",
        summary: `
        # Overview

        Linting was fine!  But let's add an annotation somewhere to try it out.

        ## What to do next

        idk
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

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
