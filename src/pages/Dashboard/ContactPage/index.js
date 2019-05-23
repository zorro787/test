import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import Contact from './Contact'

class ContactPage extends React.Component {
  static defaultProps = {
    pathName: 'Contact List Application',
    roles: ['agent', 'administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Contact List Application" />
        <Contact />
      </Page>
    )
  }
}

export default ContactPage
