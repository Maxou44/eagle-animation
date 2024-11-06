import isFirefox from '@braintree/browser-detection/is-firefox';
import isSafari from '@braintree/browser-detection/is-safari';
import { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ActionsBar from '../components/ActionsBar';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import ProjectsGrid from '../components/ProjectsGrid';
import { LS_PERMISSIONS } from '../config';
import useAppVersion from '../hooks/useAppVersion';
import useCamera from '../hooks/useCamera';
import useProjects from '../hooks/useProjects';

const HomeView = ({ t }) => {
  const { version, latestVersion, actions: versionActions } = useAppVersion();
  const { projects, actions: projectsActions } = useProjects();
  const navigate = useNavigate();
  const { actions: cameraActions } = useCamera();

  // Unload camera
  useEffect(() => {
    cameraActions.setCamera(null);
  }, []);

  // Permissions redirect
  useEffect(() => {
    if (!localStorage.getItem(LS_PERMISSIONS) && (isFirefox() || isSafari())) {
      navigate('/permissions?back=/');
    }
  }, []);

  useEffect(() => {
    // Trigger background sync
    window.EA('SYNC');
  }, []);

  const handleCreateProject = async (_, title) => {
    const project = await projectsActions.create(title || '');
    navigate(`/animator/${project.id}/0`);
    window.track('project_created', { projectId: project.id });
  };

  const handleOpenProject = async (id) => {
    navigate(`/animator/${id}/0`);
    window.track('project_opened', { projectId: id });
  };

  const handleRenameProject = async (id, title) => {
    projectsActions.rename(id, title || '');
    window.track('project_renamed', { projectId: id });
  };

  const handleLink = () => {
    versionActions.openUpdatePage();
  };

  const handleAction = (action) => {
    if (action === 'SETTINGS') {
      navigate('/settings?back=/');
    }
    if (action === 'SHORTCUTS') {
      navigate('/shortcuts?back=/');
    }
    if (action === 'REMOTE') {
      navigate('/remote?back=/');
    }
    if (action === 'KEYPAD') {
      navigate('/keypad?back=/');
    }
  };

  return (
    <>
      <Header action={handleLink} version={version} latestVersion={latestVersion} />
      <ActionsBar actions={['SETTINGS', 'SHORTCUTS', 'REMOTE', 'KEYPAD']} position="RIGHT" onAction={handleAction} />
      {projects !== null && (
        <ProjectsGrid>
          <ProjectCard placeholder={t('New project')} onClick={handleCreateProject} icon="ADD" />
          {[...projects]
            .sort((a, b) => b.project.updated - a.project.updated)
            .map((e) => (
              <ProjectCard key={e.id} id={e.id} title={e.project.title} picture={e.preview} nbFrames={e?.stats?.frames || 0} onClick={handleOpenProject} onTitleChange={handleRenameProject} />
            ))}
        </ProjectsGrid>
      )}
    </>
  );
};

export default withTranslation()(HomeView);
