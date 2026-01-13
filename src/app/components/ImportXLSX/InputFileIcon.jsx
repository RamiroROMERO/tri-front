import Icons from './InputFileIcons.svg';

export const InputFileIcon = ({name, size}) => {

  return (
    <div>
      <svg className={`icon icon-${name}`} width={size} height={size}>
        <use xlinkHref={`${Icons}#icon-${name}`} />
      </svg>
    </div>
  )
}
