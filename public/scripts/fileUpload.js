FilePond.registerPlugin( // all the plugins we want to install
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

/* FilePond.setOptions({
    stylePanelAspectRatio: 16 / 9,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 100,
}) */

FilePond.parse(document.body); // parsing all our inputs into filepond objects