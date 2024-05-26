import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import faArrowsRepeat from '../../icons/faArrowsRepeat';
import faCamera from '../../icons/faCamera';
import faCameraSettings from '../../icons/faCameraSettings';
import faDiamondHalfStroke from '../../icons/faDiamondHalfStroke';
import faEraser from '../../icons/faEraser';
import faForwardFast from '../../icons/faForwardFast';
import faFrame from '../../icons/faFrame';
import faImageCircleMinus from '../../icons/faImageCircleMinus';
import faImageCirclePlus from '../../icons/faImageCirclePlus';
import faImageEye from '../../icons/faImageEye';
import faImageEyeSlash from '../../icons/faImageEyeSlash';
import faImageSlash from '../../icons/faImageSlash';
import faPlay from '../../icons/faPlay';
import faStop from '../../icons/faStop';
import Button from '../Button';
import CustomSlider from '../CustomSlider';
import NumberInput from '../NumberInput';
import CustomTooltip from '../Tooltip';

import * as style from './style.module.css';

const MASKING_MODES = {
  DISABLED: (t) => t('Disabled'),
  UNIQUE: (t) => t('Unique'),
  CONTINUOUS: (t) => t('Continuous'),
};

const ControlBar = ({
  gridStatus = false,
  differenceStatus = false,
  onionValue = 1,
  isPlaying = false,
  isTakingPicture = false,
  isCameraReady = false,
  shortPlayStatus = false,
  loopStatus = false,
  maskingMode = 'DISABLED',
  fps = 12,
  framePosition = false,
  frameQuantity = 0,
  canDeduplicate = false,
  isCurrentFrameHidden = false,
  showCameraSettings = false,
  gridModes = [],
  onAction = null,
  t,
}) => {
  const form = useForm({
    mode: 'all',
    defaultValues: {
      fps,
    },
  });
  const { watch, register, getValues, setValue } = form;
  const formValues = watch();

  const handleAction = (action, args) => () => {
    if (onAction) {
      onAction(action, args);
    }
  };

  useEffect(() => {
    const values = getValues();
    handleAction('FPS_CHANGE', values.fps)();
  }, [JSON.stringify(formValues)]);

  useEffect(() => {
    setValue('fps', fps);
  }, [fps]);

  return (
    <div className={style.container}>
      <div className={`${style.subcontainer} ${style.left}`}>
        {!isPlaying && framePosition !== false && (
          <Button title={isCurrentFrameHidden ? t('Unhide frame') : t('Hide frame')} onClick={handleAction('HIDE_FRAME')} size="mini" icon={isCurrentFrameHidden ? faImageEye : faImageEyeSlash} />
        )}
        {!isPlaying && framePosition !== false && canDeduplicate && <Button title={t('Deduplicate frame')} onClick={handleAction('DEDUPLICATE')} size="mini" icon={faImageCircleMinus} />}
        {!isPlaying && framePosition !== false && <Button title={t('Duplicate frame')} onClick={handleAction('DUPLICATE')} size="mini" icon={faImageCirclePlus} />}
        {!isPlaying && framePosition !== false && <Button title={t('Remove frame')} onClick={handleAction('DELETE_FRAME')} size="mini" icon={faImageSlash} />}

        <Button style={{ marginLeft: 'var(--space-big)' }} title={t('Difference')} selected={differenceStatus} onClick={handleAction('DIFFERENCE')} size="mini" icon={faDiamondHalfStroke} />
        {(gridModes.includes('GRID') || gridModes.includes('CENTER') || gridModes.includes('MARGINS')) && (
          <Button title={gridStatus ? t('Disable grid') : t('Enable grid')} selected={gridStatus} onClick={handleAction('GRID')} size="mini" icon={faFrame} />
        )}

        <div className={style.slider} id="onion" data-tooltip-content={t('Onion blending')}>
          <CustomSlider step={0.01} min={0} max={1} value={onionValue} onChange={(value) => handleAction('ONION_CHANGE', value)()} />
        </div>
        <Button style={{ marginLeft: 'var(--space-big)' }} title={t('Camera settings')} selected={showCameraSettings} onClick={handleAction('CAMERA_SETTINGS')} size="mini" icon={faCameraSettings} />
        <Button
          title={t('Masking mode ({{status}})', { status: (MASKING_MODES[maskingMode] || MASKING_MODES.DISABLED)(t) })}
          selected={maskingMode !== 'DISABLED'}
          onClick={handleAction('TOOGLE_MASKING_MODE')}
          size="mini"
          icon={faEraser}
        />
      </div>
      <Button disabled={isTakingPicture || !isCameraReady} onClick={handleAction('TAKE_PICTURE')} size="normal" icon={faCamera} />
      <div className={`${style.subcontainer} ${style.right}`}>
        <div className={style.progress}>
          {framePosition === false && <span className={style.live}>{t('Live')}</span>}
          <span>{framePosition !== false && framePosition}</span>
          <span className={style.separator}>{' / '}</span>
          <span>{frameQuantity}</span>
        </div>
        <Button selectedColor="warning" title={!isPlaying ? t('Play') : t('Stop')} selected={isPlaying} onClick={handleAction('PLAY')} size="mini" icon={isPlaying ? faStop : faPlay} />
        <Button title={t('Loop')} onClick={handleAction('LOOP')} selected={loopStatus} size="mini" icon={faArrowsRepeat} />
        <Button title={t('Short play')} onClick={handleAction('SHORT_PLAY')} selected={shortPlayStatus} size="mini" icon={faForwardFast} />
        <NumberInput
          onBlur={() => handleAction('FPS_BLUR')()}
          onFocus={() => handleAction('FPS_FOCUS')()}
          style={{ marginLeft: 'var(--space-big)' }}
          min={1}
          max={60}
          tag={t('FPS')}
          register={register('fps')}
        />
        <CustomTooltip anchorId="onion" />
      </div>
    </div>
  );
};

export default withTranslation()(ControlBar);
