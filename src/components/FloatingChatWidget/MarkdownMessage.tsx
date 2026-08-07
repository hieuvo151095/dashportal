import { makeStyles, tokens } from '@fluentui/react-components'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const useStyles = makeStyles({
  content: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    '& p': {
      margin: 0,
    },
    '& p + p': {
      marginTop: tokens.spacingVerticalXS,
    },
    '& ul, & ol': {
      margin: 0,
      marginTop: tokens.spacingVerticalXXS,
      paddingLeft: tokens.spacingHorizontalL,
    },
    '& li': {
      marginBottom: tokens.spacingVerticalXXS,
    },
    '& li:last-child': {
      marginBottom: 0,
    },
    '& li > p': {
      display: 'inline',
    },
    '& strong': {
      fontWeight: tokens.fontWeightSemibold,
    },
    '& a': {
      color: 'inherit',
    },
    '& > :first-child': {
      marginTop: 0,
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  table: {
    borderCollapse: 'collapse',
    fontSize: tokens.fontSizeBase200,
    minWidth: '100%',
  },
  tableCell: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalSNudge}`,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
})

interface MarkdownMessageProps {
  text: string
}

// Render markdown thật cho tin nhắn của AI (danh sách, in đậm, bảng GFM) thay vì hiện nguyên văn
// ký tự "-"/"**"/"|" — bảng được bọc riêng trong container cuộn ngang vì khung chat khá hẹp (380px).
export function MarkdownMessage({ text }: MarkdownMessageProps) {
  const styles = useStyles()

  const components: Components = {
    table(props) {
      const { node, ...rest } = props
      void node
      return (
        <div className={styles.tableWrapper}>
          <table className={styles.table} {...rest} />
        </div>
      )
    },
    th(props) {
      const { node, ...rest } = props
      void node
      return <th className={styles.tableCell} {...rest} />
    },
    td(props) {
      const { node, ...rest } = props
      void node
      return <td className={styles.tableCell} {...rest} />
    },
  }

  return (
    <div className={styles.content}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  )
}
