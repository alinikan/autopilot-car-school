# Content and photography

## Teaching from zero

Introduce a term before using it to explain another term. Separate make, family, body, trim, model year and powertrain. Use an everyday scenario, explain a benefit and a compromise, then ask the learner to retrieve the distinction.

Use official Canadian manufacturer references for current local claims. A source from another market can illustrate recognition but must not silently supply Canadian specifications or pricing. Price examples need an exact year/version, source, amount and exclusions. Retain clear missing-price states rather than inventing a number.

## Adding a photo

1. Choose a real photograph with reusable licensing and a stable source description.
2. Verify the actual make and model, then the distinction the lesson teaches: sedan versus hatchback, SUV versus coupe body, gas versus EV, and so on. A shared platform, badge or redirected article is not sufficient evidence of identity.
3. Look at the downloaded image. Confirm it shows the intended car and retains the useful body details. Avoid an interior, concept or prototype when the activity asks learners to recognize an exterior production model.
4. Add an optimized local WebP asset in `public/cars/`. Resize/compress without cropping the source frame.
5. Add a stable photo ID to `src/photo-manifest.json`, recording the pictured label, manufacturer, asset filename, dimensions, photographer, licence, licence URL, source URL, description and a short reference note.
6. Update `public/image-credits.json`, including the resize/compression notice.
7. Add the photo ID to the appropriate model's `photos` list in `src/academy-data.json`. Its `image` field is the primary quiz reference and should be the first photo ID.
8. Run the tests and inspect the rendered lesson, quiz and enlarged view on phone and desktop. For a release, verify the hosted bytes with `npm run verify:photos`.

Group lessons should show separately labelled examples for the distinct families or bodies being contrasted. A family guide does not promise a photo of every model year, engine, trim or regional variant.

## Display and identity

Use `CarPhoto` and `PhotoGallery` rather than constructing a new URL or using `cover`. The shared frame fits the entire source image. The enlarged dialog is bounded by the viewport and sits above the lesson dialog.

Lesson captions identify the pictured car. Quiz mode uses a neutral description and withholds identity captions. Do not reveal the answer through alt text, the enlarged dialog's title or a source label before the learner answers.

## Compatibility

Photo IDs and quiz IDs serve different purposes. Replacing a misidentified picture must not change an existing question's correct answer. The course tests preserve historical answer mappings and verify that every model guide has licensed, local photos belonging to its manufacturer.

The original source description remains the attribution reference. A concise on-screen reference note explains that a pictured year, market or trim can differ from a Canadian catalogue record.
