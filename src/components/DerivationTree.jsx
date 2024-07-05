'use client';

import React, { useState, useEffect, useRef } from 'react';
import Text from './Text';
import './DerivationTree.css';

const DerivationTree = ({ data, onExpand }) => {
  const [expanded, setExpanded] = useState(true);
  const [innerExpanded, setInnerExpanded] = useState(false);
  const lineRef = useRef(null);
  const ruleRef = useRef(null);

  useEffect(() => {
    const line = lineRef.current;
    const rule = ruleRef.current;
    // Assign the y position of the line to the y position of the rule
    if (line && rule) {
      rule.style.top = `${line.offsetTop - 10}px`;
    }
    if (onExpand) {
      onExpand(innerExpanded ? false : expanded);
    }
  }, [expanded, innerExpanded, onExpand]);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
    if (onExpand) {
      onExpand(!expanded);
    }
  };
  
  return (
    <div className="derivation-tree">
      {data.rule && (
        <div className='subtree-rule'>          
          <div className='subtree'>
            {data.children && expanded && (
              <div className="children">
                {Object.values(data.children).map((child, index) => (
                  <div key={index} className="child">
                    <DerivationTree data={child} onExpand={(expanded) => setInnerExpanded(expanded)} />
                  </div>
                ))}
              </div>
            )}
            <div className="border" ref={lineRef}></div>
            <Text text={data.text} />
          </div>
          <div className={data.rule !== "[NoInfo]" ? "rule-text" : "rule-text"} ref={ruleRef} onClick={toggleExpanded}>
            {data.rule}
          </div>
        </div>
      )}
      {!data.rule && <Text text={data.text} />}
    </div>
  );
};

export default DerivationTree;