import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl, FormHelperText, InputLabel } from '@material-ui/core'
import pandocData from '../data/pandoc.json'
import rq from 'superagent'

class Converter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serverResponse: null,
      serverError: null,
      text: '',
      formatFrom: 'markdown',
      formatTo: 'html'
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  convert() {
    // TODO: use form validation for this
    if (!this.state.text || !this.state.formatFrom || !this.state.formatTo) return

    rq.post('https://api.paperify.org/convert/text')
      .type('json')
      .send({
        text: this.state.text,
        from: this.state.formatFrom,
        to: this.state.formatTo,
        // TODO: fix this
        ext: ['beamer', 'pdf'].includes(this.state.formatTo) ? 'pdf' : 'txt'
      })
      .then((res) => {
        this.setState({ serverResponse: res.body })
      })
      .catch(err => {
        console.error(err)
        this.setState({ serverError: err })
      })
  }

  renderInputFrom() {
    return (
      <Card>
        <Typography variant='subtitle1'>Input</Typography>
        <CardContent>
          <textarea
            name='text'
            value={this.state.text}
            onChange={this.handleChange}
            style={{ width: '100%', minHeight: '200px' }}
          />
        </CardContent>
        <CardActions>
          <FormControl>
            <InputLabel>From</InputLabel>
            <Select
              name='formatFrom'
              value={this.state.formatFrom}
              onChange={this.handleChange}
            >
              { pandocData.from.map(format => <MenuItem key={`from-${format}`} value={format}>{format}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>To</InputLabel>
            <Select
              name='formatTo'
              value={this.state.formatTo}
              onChange={this.handleChange}
            >
              { pandocData.to.map(format => <MenuItem key={`to-${format}`} value={format}>{format}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={_ => this.convert()}>Convert</Button>
        </CardActions>
      </Card>
    )
  }

  renderOutputTo() {
    let preview = null

    const ext = this.state.serverResponse.ext || ''
    if (ext === 'pdf') {
      preview = <embed
        src={this.state.serverResponse.downloadLink}
        type='application/pdf'
        style={{ width: '100%', minHeight: '500px' }}
      />
    } else if (!['docx'].includes(ext)) {
      preview = <textarea disabled value={this.state.serverResponse.text} />
    }

    return <Card>
      <Typography variant='subtitle1'>Output</Typography>
      <CardContent>
        { preview }
      </CardContent>
      <CardActions>
        <Button onClick={() => window.open(this.state.serverResponse.downloadLink, '_blank')}>Download</Button>
      </CardActions>
    </Card>
  }

  render() {
    if (!this.state.serverResponse) {
      return (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            { this.renderInputFrom() }
          </Grid>
        </Grid>
      )
    }

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={6}>
          { this.renderInputFrom() }
        </Grid>
        <Grid item xs={12} md={6}>
          { this.renderOutputTo() }
        </Grid>
      </Grid>
    )
  }
}

export default Converter