# Local marketing refinements

1. Preserve the hero composition while removing its plate image; replace the features plate with four branded visual previews; repair logo clipping and add invoice-only hover feedback.
2. Extend existing Support conversations to receive anonymous trial applications without provisioning accounts. Persist contacts in the conversation's initial message; protect reads/replies with existing Admin authorization; deduplicate retry IDs and normalized content.
3. Add a bilingual accessible form with backend validation, pending/error/success states and safe retry behavior. Preserve entered data on failure and during preference switches.
4. Verify real PostgreSQL persistence and the unchanged Admin Support interface, invalid input, concurrent duplicates, isolation, server failures, mobile/tablet/desktop layouts, themes and languages.

No commit, push, merge or deployment is authorized for this refinement task. Database migration verification uses disposable local databases only. Existing application interfaces and deployment workflows remain out of scope.
