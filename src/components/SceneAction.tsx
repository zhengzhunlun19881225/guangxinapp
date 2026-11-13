import type {CSSProperties, ReactNode, KeyboardEvent} from 'react';

export type Action = {type: string; value: string};
export type SceneProps = {onAction: (action: Action) => void; filters?:{company:string;year:string;factor:number}};
type Props = SceneProps & {
  action: Action;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-node-id'?: string;
};

/** Retains exported text geometry while providing accessible activation. */
export function SceneAction({action, onAction, children, ...props}: Props) {
  function activate(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onAction(action);
    }
  }
  return <p {...props} role="button" tabIndex={0}
    onClick={() => onAction(action)} onKeyDown={activate}>{children}</p>;
}
