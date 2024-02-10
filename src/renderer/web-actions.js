const getDefaultPreview = (data) => {
    for (let i = 0; i < (data?.project?.scenes?.length || 0); i++) {
        for (const picture of data?.project?.scenes?.[i]?.pictures || []) {
            if (!picture.deleted) {
                return `${data._path}/${i}/${picture.filename}`;
            }
        }
    }
    return null;
}

// TODO: .preview => img to display
const computeProject = (data) => {
    let preview = getDefaultPreview(data);
    const scenes = data.project.scenes.map((scene, i) => ({
        ...scene,
        pictures: scene.pictures.filter(p => !p.deleted).map(picture => ({
            ...picture,
            link: `${data._path}/${i}/${picture.filename}`,
        }))
    }))

    return {
        ...data,
        id: data._path.replaceAll('\\', '/').split('/').pop(),
        preview,
        project: {
            ...data.project,
            scenes
        },
        _path: null,
        _file: null
    };
}

const actions = {
    GET_LAST_VERSION: async () => {
        // Web version is always up-to-date, ignore update detection
        return { version: null };
    },
    GET_PROJECTS: async () => {
       /* const projects = await getProjectsList(PROJECTS_PATH);
        return projects.map(computeProject);*/
        return [];
    },
    NEW_PROJECT: async (evt, { title }) => {
       /* const data = await createProject(PROJECTS_PATH, title);
        return computeProject(data);*/

    },
    GET_PROJECT: async (evt, { project_id }) => {
       /* const data = await getProjectData(join(PROJECTS_PATH, project_id));
        return computeProject(data);*/
    },
    DELETE_PROJECT: async (evt, { project_id }) => {
       /* await deleteProject(join(PROJECTS_PATH, project_id));
        return null;*/
    },
    DELETE_FRAME: async (evt, { project_id, track_id, frame_id }) => {
       /* const data = await deleteProjectFrame(join(PROJECTS_PATH, project_id), track_id, frame_id);
        return computeProject(data);*/
    },
    DUPLICATE_FRAME: async (evt, { project_id, track_id, frame_id }) => {
       /* const data = await applyProjectFrameLengthOffset(join(PROJECTS_PATH, project_id), track_id, frame_id, 1);
        return computeProject(data);*/
    },
    DEDUPLICATE_FRAME: async (evt, { project_id, track_id, frame_id }) => {
       /* const data = await applyProjectFrameLengthOffset(join(PROJECTS_PATH, project_id), track_id, frame_id, -1);
        return computeProject(data);*/
    },
    MOVE_FRAME: async (evt, { project_id, track_id, frame_id, before_frame_id = false }) => {
       /* const data = await moveFrame(join(PROJECTS_PATH, project_id), track_id, frame_id, before_frame_id);
        return computeProject(data);*/
    },
    RENAME_PROJECT: async (evt, { project_id, title }) => {
       /* const data = await renameProject(join(PROJECTS_PATH, project_id), title);
        return computeProject(data);*/
    },
    UPDATE_FPS_VALUE: async (evt, { project_id, track_id, fps }) => {
       /* const data = await updateSceneFPSvalue(join(PROJECTS_PATH, project_id), track_id, fps);
        return computeProject(data);*/
    },
    OPEN_LINK: async (evt, { link }) => {
       /* shell.openExternal(link);
        return null;*/
    },
    TAKE_PICTURE: async (evt, { project_id, track_id, buffer, before_frame_id = false }) => {
       /* const data = await takePicture(join(PROJECTS_PATH, project_id), track_id, 'jpg', before_frame_id, buffer);
        return computeProject(data);*/
    },
    GET_SETTINGS: async () => {
        //return getSettings(PROJECTS_PATH);
        return {
            CAMERA_ID: 0,
            CAPTURE_FRAMES: 1,
            AVERAGING_ENABLED: false,
            AVERAGING_VALUE: 3,
            //LANGUAGE: 'en', // default Handled by front side
            SHORT_PLAY: 20,
            RATIO_OPACITY: 1,
            GRID_OPACITY: 1,
            GRID_MODES: ['GRID'], // GRID | CENTER | MARGINS
            GRID_LINES: 3,
            GRID_COLUMNS: 3,
            EVENT_KEY: '',
        };
    },
    SAVE_SETTINGS: async (evt, { settings }) => {
       // return saveSettings(PROJECTS_PATH, settings);
       return {};
    },
    SYNC: async () => {
        /*let syncList = await getSyncList(PROJECTS_PATH);

        console.log('[SYNC]', 'Starting event videos sync', syncList);

        for (let i = 0; i < syncList.length; i++) {
            const syncElement = syncList[i];
            try {
                if (!syncElement.isUploaded) {
                    await uploadFile(syncElement.apiKey, syncElement.publicCode, syncElement.fileExtension, join(PROJECTS_PATH, '/.sync/', syncElement.fileName));
                    syncList[i].isUploaded = true;
                    await saveSyncList(PROJECTS_PATH, syncList);
                }
            } catch (err) {
                console.error(err);
            }
        }

        console.log('[SYNC]', 'End of sync', syncList);*/
    },
    EXPORT: async (evt, {
        project_id,
        track_id,
        mode = 'video',
        format = 'h264',
        resolution = 'original',
        duplicate_frames_copy = true,
        duplicate_frames_auto = false,
        duplicate_frames_auto_number = 2,
        custom_output_framerate = false,
        custom_output_framerate_number = 10,
        public_code = 'default',
        event_key = '',
        translations = {
            EXPORT_FRAMES: '',
            EXPORT_VIDEO: '',
            DEFAULT_FILE_NAME: '',
            EXT_NAME: '',
        }
    }) => {
        /*if (mode === 'frames') {
            const path = await selectFolder(translations.EXPORT_FRAMES);
            if (path) {
                await normalizePictures(join(PROJECTS_PATH, project_id), track_id, path, {
                    duplicateFramesCopy: duplicate_frames_copy,
                    duplicateFramesAuto: duplicate_frames_auto,
                    duplicateFramesAutoNumber: duplicate_frames_auto_number,
                });
            }
            return true;
        }

        const profile = getProfile(format);

        // Create sync folder if needed
        if (mode === 'send') {
            await mkdirp(join(PROJECTS_PATH, '/.sync/'));
        }

        const path = mode === 'send' ? join(PROJECTS_PATH, '/.sync/', `${public_code}.${profile.extension}`) : await selectFile(translations.DEFAULT_FILE_NAME, profile.extension, translations.EXPORT_VIDEO, translations.EXT_NAME);
        await exportProjectScene(join(PROJECTS_PATH, project_id), track_id, path, format, {
            duplicateFramesCopy: duplicate_frames_copy,
            duplicateFramesAuto: duplicate_frames_auto,
            duplicateFramesAutoNumber: duplicate_frames_auto_number,
            customOutputFramerate: custom_output_framerate,
            customOutputFramerateNumber: custom_output_framerate_number,
            resolution
        });

        if (mode === 'send') {
            const syncList = await getSyncList(PROJECTS_PATH);
            await saveSyncList(PROJECTS_PATH, [
                ...syncList, {
                    apiKey: event_key,
                    publicCode: public_code,
                    fileName: `${public_code}.${profile.extension}`,
                    fileExtension: profile.extension,
                    isUploaded: false
                }
            ]);

            actions.SYNC();
        }

        return true;*/
    }
}

export default actions;
