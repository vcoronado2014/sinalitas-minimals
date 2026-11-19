import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import { useLocation } from 'react-router-dom';
// @mui
import { Collapse } from '@mui/material';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import { NavListProps } from '../types';
import NavItem from './NavItem';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
};

export default function NavList({ data, depth, hasChild }: NavListRootProps) {

  const { pathname } = useLocation();

  const { active, isExternalLink } = useActiveLink(data.path);

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    
      <>
        <NavItem
          item={data}
          depth={depth}
          open={open}
          active={active}
          isExternalLink={isExternalLink}
          onClick={handleToggle}
        />

        {hasChild && (
          <Collapse in={open} unmountOnExit>
            <NavSubList data={data.children} depth={depth} />
          </Collapse>
        )}
      </>
    
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
};

function NavSubList({ data, depth }: NavListSubProps) {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');


  return (
    <>
      {data.map((list) =>
        isDesktop ? (
          list.upMd && (
            <NavList
              key={list.title + list.path}
              data={list}
              depth={depth + 1}
              hasChild={!!list.children}
            />
          )) : (
          (list.upMd || list.upMd === false) && list.upXs && (
            <NavList
              key={list.title + list.path}
              data={list}
              depth={depth + 1}
              hasChild={!!list.children}
            />
          )
        )
      )}
    </>
  );

/*   return (
    <>
      {data.map((list) =>
        (isDesktop && (!list.onlyMd || list.upMd)) || (!isDesktop && list.onlyMd && !list.upMd) ? (
          <NavList
            key={list.title + list.path}
            data={list}
            depth={depth + 1}
            hasChild={!!list.children}
          />
        ) : null
      )}
    </>
  ); */
/*   return (
    <>
      {data.map((list) => {
        // Verifica si list.onlyDesktop es verdadero y isDesktop también es verdadero
        if (list.onlyDesktop && isDesktop) {
          return (
            <NavList
              key={list.title + list.path}
              data={list}
              depth={depth + 1}
              hasChild={!!list.children}
            />
          );
        } 
      })}
    </>
  ); */
}
