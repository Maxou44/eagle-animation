import { useRef } from 'react';

import IconAdd from './assets/add.svg?jsx';
import IconEdit from './assets/edit.svg?jsx';
import IconOpen from './assets/open.svg?jsx';

import * as style from './style.module.css';
import { withTranslation } from 'react-i18next';

let renameEvents = {};

const ProjectCard = ({ id = '', placeholder = '', title = '', picture = '', onClick = null, onTitleChange = null, icon = 'EDIT', t }) => {
  const ref = useRef(null);

  const handleClick = () => {
    if (onClick) {
      onClick(id, ref?.current?.value || '');
    }
  };

  const handleRename = (evt) => {
    if (!onTitleChange || !id) {
      return;
    }

    if (renameEvents[id]) {
      clearTimeout(renameEvents[id]);
    }
    renameEvents[id] = setTimeout(() => {
      onTitleChange(id, evt.target.value);
    }, 250);
  };

  return (
    <div className={style.box}>
      <div className={style.banner}>{picture && <img alt="" src={picture} loading="lazy" />}</div>
      <div role="button" tabIndex={0} className={style.bannerhover} onClick={handleClick}>
        {icon === 'ADD' && <IconAdd />}
        {icon === 'EDIT' && <IconEdit />}
        {icon === 'OPEN' && <IconOpen />}
      </div>
      <div className={style.title}>
        <input placeholder={placeholder || t('Untitled')} ref={ref} defaultValue={title || ''} onChange={handleRename} />
      </div>
    </div>
  );
};

export default withTranslation()(ProjectCard);
