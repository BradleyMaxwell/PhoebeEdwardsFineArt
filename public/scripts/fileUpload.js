FilePond.registerPlugin( // all the plugins we want to install
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.parse(document.body); // parsing all our inputs into filepond objects