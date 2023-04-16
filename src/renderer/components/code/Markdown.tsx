import React, { ReactNode, useCallback, useMemo } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  Link,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TypographyProps,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import {
  CodeProps,
  HeadingProps,
  LiProps,
  OrderedListProps,
  SpecialComponents,
  TableDataCellProps,
  TableHeaderCellProps,
  UnorderedListProps,
} from 'react-markdown/lib/ast-to-react';
import { NormalComponents } from 'react-markdown/lib/complex-types';
import Divider from '@mui/material/Divider';
import { get, toString, trim } from 'lodash';
import { InlineCodeLabel } from './InlineCodeLabel';
import { useScrollAndHighlightElement } from '../../hooks/useScrollAndHighlightElement';
import CodeEditor, { ProgrammingLanguage } from './CodeEditor';

function MarkdownParagraph(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}

const MarkdownHeading = ({ ...props }: HeadingProps) => {
  let variant: TypographyProps['variant'];
  switch (props.level) {
    case 1:
      variant = 'h6';
      break;
    case 2:
      variant = 'subtitle1';
      break;
    case 3:
      variant = 'subtitle2';
      break;
    case 4:
      variant = 'body1';
      break;
    case 5:
      variant = 'body2';
      break;
    case 6:
      variant = 'caption';
      break;
    default:
      variant = 'h6';
      break;
  }
  return (
    <Typography gutterBottom variant={variant} sx={{ mt: 1 }}>
      {props.children}
    </Typography>
  );
};

const MarkdownList = ({ ...props }: UnorderedListProps | OrderedListProps) => {
  return (
    <List dense disablePadding sx={{ pl: 2.5 }}>
      {props.children}
    </List>
  );
};

const MarkdownListItem = ({ children, node, ordered, ...props }: LiProps) => {
  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'list-item',
        listStyle: ordered ? 'decimal' : 'disc',
        color: 'text.secondary',
      }}
      {...props}
    >
      <Typography component={'span'} variant={'body2'}>
        {children}
      </Typography>
    </ListItem>
  );
};

const MarkdownTable = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <Paper>
      <Table size="small">{children}</Table>
    </Paper>
  );
};

const MarkdownTableHeaderCell = ({ children, style, ...props }: TableHeaderCellProps) => {
  return <TableCell style={style}>{children}</TableCell>;
};

const MarkdownTableDataCell = ({ children, style, ...props }: TableDataCellProps) => {
  return <TableCell style={style}>{children}</TableCell>;
};

const MarkdownTableRow = (props: { children: ReactNode }) => {
  const { children } = props;
  return <TableRow>{children}</TableRow>;
};

const MarkdownTableBody = (props: { children: ReactNode }) => {
  const { children } = props;
  return <TableBody>{children}</TableBody>;
};

const MarkdownTableHead = (props: { children: ReactNode }) => {
  const { children } = props;
  return <TableHead>{children}</TableHead>;
};

const MarkdownCode = ({ children, inline, ...props }: CodeProps) => {
  const { node } = props;

  const code = useMemo<string>(() => trim(toString(get(node, 'children[0].value') || '')), [node]);
  const language = useMemo<string>(
    () => trim(toString(get(node, 'properties.className[0]') || '')).replace('language-', ''),
    [node]
  );

  return (
    <>
      {inline ? (
        <InlineCodeLabel code={code} sx={{ display: 'inline' }} />
      ) : (
        <CodeEditor value={code} language={language as ProgrammingLanguage} editable={false} />
      )}
    </>
  );
};

const MarkdownLink = (props: { href?: string }) => {
  const { href, ...rest } = props;

  const scrollAndHighlight = useScrollAndHighlightElement();

  const onClick = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      if (href) {
        if (href.startsWith('#')) {
          scrollAndHighlight(href.substring(1));
        } else {
          window.open(href, '_blank');
        }
      }
    },
    [href]
  );

  return <Link href={href} onClick={onClick} {...rest} />;
};

const renderers: Partial<Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents> = {
  h1: MarkdownHeading,
  h2: MarkdownHeading,
  h3: MarkdownHeading,
  h4: MarkdownHeading,
  h5: MarkdownHeading,
  h6: MarkdownHeading,
  p: MarkdownParagraph,
  ul: MarkdownList,
  ol: MarkdownList,
  li: MarkdownListItem,
  code: MarkdownCode,
  table: MarkdownTable,
  thead: MarkdownTableHead,
  tbody: MarkdownTableBody,
  tr: MarkdownTableRow,
  th: MarkdownTableHeaderCell,
  td: MarkdownTableDataCell,
  a: MarkdownLink,
  hr: ({ node, ...props }) => <Divider sx={{ my: 1 }} {...props} />,
  blockquote: ({ node, ...props }) => (
    <Alert variant={'outlined'} severity={'info'}>
      {props.children}
    </Alert>
  ),
  em: ({ node, ...props }) => (
    <Box component={'span'} sx={{ fontStyle: 'italic' }}>
      {props.children}
    </Box>
  ),
  strong: ({ node, ...props }) => (
    <Box component={'span'} sx={{ fontWeight: 700 }}>
      {props.children}
    </Box>
  ),
  del: ({ node, ...props }) => (
    <Box component={'span'} sx={{ textDecoration: 'line-through' }}>
      {props.children}
    </Box>
  ),
  input: ({ node, ...props }) => {
    switch (props.type) {
      case 'checkbox':
        return <Checkbox checked={props.checked} disabled={props.disabled} sx={{ p: 0, pr: 0.5 }} />;
      default:
        return <input {...props} />;
    }
  },
};

interface MarkdownProps extends ReactMarkdownOptions {}

export default function Markdown({ children, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      linkTarget={'_blank'}
      components={renderers}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}
