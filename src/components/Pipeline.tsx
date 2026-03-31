import { pipelineItems } from '../data/stages'

type Props = {
  activeIndex: number
  onClick: (index: number) => void
}

export default function Pipeline({ activeIndex, onClick }: Props) {
  return (
    <div className="pipeline">
      {pipelineItems.map((item, i) => (
        <div
          key={item.id}
          className={`arrow-stage${activeIndex === i ? ' active' : ''}`}
          onClick={() => onClick(i)}
        >
          <div className="arrow-body">
            <div className="arrow-label">{item.label}</div>
            <div className="arrow-label-sub">{item.sub}</div>
          </div>
          <div className="arrow-tip" />
        </div>
      ))}
    </div>
  )
}
