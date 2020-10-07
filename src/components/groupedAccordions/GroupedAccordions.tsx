import CollapsiblePanel from '@department-of-veterans-affairs/formation-react/CollapsiblePanel';
import * as classNames from 'classnames';
import * as React from 'react';

import './GroupedAccordions.scss';

declare const window: { VetsGov: Record<string, unknown> };

export interface PanelContent {
  readonly body: string | JSX.Element;
  readonly title: string;
}

interface IGroupedAccordionsProps {
  readonly panelContents: PanelContent[];
  readonly title: string;
}

interface ICollapsiblePanelStates {
  open: boolean;
}

// Convenience types purely for code readability
type CollapsiblePanelComponent = React.Component<unknown, ICollapsiblePanelStates>;
type CollapsiblePanelComponentRef = React.RefObject<CollapsiblePanelComponent>;

const GroupedAccordions = (props: IGroupedAccordionsProps): JSX.Element => {
  const [allExpanded, setAllExpanded] = React.useState(false);
  const [panelRefs, setPanelRefs] = React.useState<CollapsiblePanelComponentRef[]>([]);

  React.useEffect(() => {
    // CollapsiblePanel expects a VetsGov object on the global window
    if (!window.VetsGov) {
      window.VetsGov = { scroll: null };
    }

    return () => {
      setPanelRefs([]);
    };
  }, []);

  const handleExpandCollapse = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    panelRefs
      .filter(ref => ref.current && (ref.current.state.open === allExpanded))
      .forEach(ref => {
        if (ref.current) {
          ref.current.setState({open: !allExpanded});
        }
      });
    setAllExpanded(!allExpanded);
  };

  return (
    <section className={classNames('va-grouped-accordion', 'vads-u-margin-bottom--2p5')}>
      <div className={classNames(
        'vads-u-display--flex',
        'vads-u-justify-content--space-between',
        'vads-u-align-items--center',
      )}>
        <h3>{props.title}</h3>
        <button 
          className={classNames(
            'va-api-grouped-accordions-button',
            'vads-u-color--primary',
            'vads-u-margin--0',
            'vads-u-padding--0',
            'vads-u-text-decoration--underline',
            'vads-u-font-weight--normal',
            'vads-u-width--auto',
          )}
          onClick={(event) => handleExpandCollapse(event)}
        >
          {!allExpanded ? 'Expand all' : 'Collapse all'}
        </button>
      </div>
      {props.panelContents.map((c: PanelContent, index: number) => {
        const panelRef: CollapsiblePanelComponentRef = React.createRef<CollapsiblePanelComponent>();
        panelRefs.push(panelRef);
        return (
          <CollapsiblePanel ref={panelRef} panelName={c.title} startOpen={allExpanded} key={index}>
            {c.body}
          </CollapsiblePanel>
        );
      })}
    </section>
  );
};

export { GroupedAccordions };